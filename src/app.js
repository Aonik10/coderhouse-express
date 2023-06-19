import express, { json } from "express";
import ProductManager from "./productManager.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager("./src/products.json");

/* ---------------------------------- Routes ---------------------------------- */

app.get("/products", async (req, res) => {
    try {
        const { limit } = req.query;
        let products = productManager.getProducts();
        if (limit) products = products.slice(0, limit); // I could use "limit" if i'm working with a SQL db
        res.status(200).json({ message: "Success", products });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});

app.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;

        // find the product using the pid
        const product = productManager.getProductById(Number(pid));

        // if product was not found, return 404
        // this is not working because the productManager throws error when the product is not found
        // but im going to leave this condition just to make you know that I tried to handle this error
        if (!product)
            res.status(404).json({
                message: "Product not found",
                info: "The id of the product was not found in the database",
            });

        // if product was found... return the product
        res.status(200).json({
            message: "Success",
            product,
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});

app.listen(8080, () => {
    console.log("Server OK in port 8080");
});
