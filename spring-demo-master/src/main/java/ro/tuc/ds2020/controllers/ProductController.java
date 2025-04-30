package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.ProductDTO;
import ro.tuc.ds2020.services.ProductService;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getProducts() {
        List<ProductDTO> products = productService.findAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/{name}")
    public ResponseEntity<ProductDTO> getProductByName(@PathVariable String name) {
        ProductDTO product = productService.findProductByName(name);
        if (product != null) {
            return new ResponseEntity<>(product, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<Void> createProduct(@RequestBody ProductDTO productDTO) {
        productService.insert(productDTO);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/{name}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable String name, @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(name, productDTO);
        if (updatedProduct != null) {
            return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String name) {
        boolean isDeleted = productService.deleteProduct(name);
        if (isDeleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
