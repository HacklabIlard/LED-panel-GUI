const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const { SerialPort } = require("serialport")

dotenv.config()

const PORT = parseInt(process.env.SERVER_PORT) || 3001

const app = express()
app.use(express.json())

const corsOptions = {
  origin: process.env.ORIGIN,
  optionsSuccesStatus: 200
}

app.use(cors(corsOptions))

const serial = new SerialPort({
  path: process.env.ARDUINO_PATH,
  baudRate: parseInt(process.env.ARDUINO_BAUD_RATE)
})

app.listen(PORT, () => {
  console.log(`Server is listening on ${ PORT }`)
})

app.get("/", (req, res) => {
  res.html("OK")
})

app.get("/clear", (req, res) => {
  const command = "clear"

  serial.write(Buffer.from(command, 'utf-8'), (err) => {
    if (err) return console.log(err.message)
  })

  res.status(200).send("Données effacées avec succès !")
})

app.post("/send", (req, res) => {
  
  let bytes = new Array()
  let byte = new Array()

  req.body.leds.forEach(led => {

    byte = led.split(",");
  
    bytes.concat(byte)
  });

  serial.write(Buffer.from(bytes), (err) => {
    if (err) return console.log(err.message)
  })

  res.status(200).send("Données envoyées avec succès !")
})
