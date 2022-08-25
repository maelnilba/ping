# Dumbly basic API for timeout actions `when using serverless`.

    next-app/
    ├─ src/
    │  ├─ api/
    │  │  ├─ pong.ts
    │  │  ├─ ping.ts
    │  ├─ index.js

## Example

    fetch('https://ping4.herokuapp.com/ping?url=<pong_url>&ms_time=<timeout_in_ms>&key=<key>&id="test"', { method: "GET"});
    fetch('https://ping4.herokuapp.com/ping?url=<pong_url>&key=<key>&id="test', { method: "DELETE"});

## in ping.ts

    params: {
    	data?:  string  |  undefined;
    	key?:  string  |  undefined;
    	url:  string;
    	ms_time:  string;
    }
    async pong<T>(data: T, ms_time: number) {

        const obj: PongParams = {
        url: this.url,
        ms_time: String(ms_time),

        data: typeof data !== "string" ? JSON.stringify(data) : data,
        };

        if (this.key) obj["key"] = this.key;
        const url = new URL(this.ping_url);
        url.search = new URLSearchParams(
        this.key ? { ...obj, key: this.key } : obj
        ).toString();

        const res = (await fetch(url, {
    	    method: "GET",
    	    })
        ).json();

        return res;
        }
    }

## in pong.ts

    export default handler = (req, res) => {
        if (req.headers.authorization !== ping.key) {
    	    res.status(404).json({ error: "bad key" });
    	    return;
    	}
        const data = dataSchema.parse(JSON.parse(req.body));
    }
