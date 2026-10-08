import express from "express";
import fs from "fs"; //treballar amb arxius
import bodyParser from "body-parser"; //Ho afegim per entendre que estem rebent un json des de la petició post.

const router = express.Router();

const readData = () => {
    try {
        const data = fs.readFileSync("./db/db.json");
        //console.log(data);
        //console.log(JSON.parse(data));
        return JSON.parse(data)

    } catch (error) {
        console.log(error);
    }
};
//Funció per escriure informació
const writeData = (data) => {
    try {
        fs.writeFileSync("./db/db.json", JSON.stringify(data));

    } catch (error) {
        console.log(error);
    }
}
//Funció per llegir la informació
//readData();

router.get("/", (req, res) => {
    const user = { name: "Kevin" }
    const htmlMessage = `
   <p>Aquest és un text <strong>amb estil</strong> i un enllaç:</p>
   <a href="https://www.example.com">Visita Example</a>`;
    const data = readData();
    res.render("products", { user, data, htmlMessage })
    //res.json(data.products);

});

//Creem un endpoint per obtenir tots els llibres
router.get("/", (req, res) => {
    const data = readData();
    res.json(data.products);
})
//Creem un endpoint per obtenir un llibre per un id
router.get("/:id", (req, res) => {
    const data = readData();
    //Extraiem l'id de l'url recordem que req es un objecte tipus requets
    // que conté l'atribut params i el podem consultar
    const id = parseInt(req.params.id);
    const product = data.products.find((product) => product.id === id);
    res.json(product);
})

//Creem un endpoint del tipus post per afegir un llibre

router.post("/", (req, res) => {
    const data = readData();
    const body = req.body;
    //todo lo que viene en ...body se agrega al nuevo libro
    const newProduct = {
        id: data.products.length + 1,
        ...body,
    };
    data.products.push(newProduct);
    writeData(data);
    res.json(newProduct);
});

//Creem un endpoint per modificar un llibre


router.put("/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const productIndex = data.products.findIndex((product) => product.id === id);
    data.products[productIndex] = {
        ...data.products[productIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "Product updated successfully" });
});

//Creem un endpoint per eliminar un llibre
router.delete("/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const productIndex = data.products.findIndex((product) => product.id === id);
    //splice esborra a partir de productIndex, el número de elements 
    // que li indiqui al segon argument, en aquest cas 1
    data.products.splice(productIndex, 1);
    writeData(data);
    res.json({ message: "Product deleted successfully" });
});

router.use(express.static("public")); //carpeta publica pel css

export default router;

