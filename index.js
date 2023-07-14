import express, { response } from "express"
import 'dotenv/config'
import axios from "axios";
import morgan from 'morgan'

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(morgan('dev'))

app.post("/auth", async (req, res) => {
    await axios.post("https://accounts.spotify.com/api/token", {
        grant_type: process.env.CLIENT_CREDENTIALS,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response => {
        res.send(response.data)
    }).catch(error => {
        res.send(error)
    })
})

app.get("/audio-analysis/:id", async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: "Please insert token!" })    
    }

    await axios.get(`https://api.spotify.com/v1/audio-analysis/${req.params.id}`, {
        headers: {
            'Authorization': req.headers.authorization
        }
    }).then(response => {
        res.send(response.data)
    }).catch(error => {
        res.send(error)
    })
});

app.get('/recommendations', async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: "Please insert token!" })    
    }

    if (Object.keys(req.query).length <= 0) {
        return res.status(401).send({ message: "Please insert filter!" })    
    }

    let data_filter = ""
    let idx = 0
    for (const key in req.query) {
        if (idx == 0) {
            data_filter += `?${key}=${req.query[key]}`
        } else {
            data_filter += `&${key}=${req.query[key]}`
        }
        idx++
    }

    await axios.get(`https://api.spotify.com/v1/recommendations${data_filter}`, {
        headers: {
            'Authorization': req.headers.authorization
        }
    }).then(response => {
        res.send(response.data)
    }).catch(error => {
        res.send(error)
    })
});

app.get('/playlists/:id', async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: "Please insert token!" })    
    }

    await axios.get(`https://api.spotify.com/v1/playlists/${req.params.id}`, {
        headers: {
            'Authorization': req.headers.authorization
        }
    }).then(response => {
        res.send(response.data)
    }).catch(error => {
        res.send(error)
    })
});

const port = 8080;
const host = "localhost";

app.listen(port,host,()=>{
    console.log(`server berjalan di http://${host}:${port}`);
});