package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.dtos.ProductDTO;
import ro.tuc.ds2020.dtos.builders.ProductBuilder;
import ro.tuc.ds2020.entities.Product;
import ro.tuc.ds2020.repositories.ProductRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ProductService.class);
    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductDTO> findAllProducts() {
        List<Product> productList = productRepository.findAll();
        return productList.stream()
                .map(ProductBuilder::toProductDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO insert(ProductDTO productDTO) {
        // Check if a product with the same name already exists (optional)
        Optional<Product> existingProduct = productRepository.findByName(productDTO.getName());
        if (existingProduct.isPresent()) {
            LOGGER.error("Product with name '{}' already exists. Cannot insert duplicate.", productDTO.getName());
            return null; // or throw a custom exception if required
        }

        // Convert DTO to Entity
        Product product = ProductBuilder.toEntity(productDTO);

        // Save to database
        product = productRepository.save(product);

        LOGGER.debug("Product with name '{}' was inserted in db", product.getName());

        // Return the saved product as a DTO
        return ProductBuilder.toProductDTO(product);
    }


    public ProductDTO findProductByName(String name) {
        Optional<Product> productOptional = productRepository.findByName(name);
        if (productOptional.isPresent()) {
            return ProductBuilder.toProductDTO(productOptional.get());
        } else {
            LOGGER.error("No product found with the name '{}'", name);
            return null; // Or throw a custom exception
        }
    }

    public ProductDTO updateProduct(String name, ProductDTO productDTO) {
        Optional<Product> productOptional = productRepository.findByName(name);
        if (!productOptional.isPresent()) {
            LOGGER.error("Product with name '{}' not found for update", name);
            return null; // or throw an exception
        }
        Product product = productOptional.get();
        product.setName(productDTO.getName());
        product.setQuantity(productDTO.getQuantity());
        product.setPrice(productDTO.getPrice());
        product.setInStock(productDTO.isInStock());
        product = productRepository.save(product);
        LOGGER.debug("Product with name '{}' was updated in db", product.getName());
        return ProductBuilder.toProductDTO(product);
    }

    public boolean deleteProduct(String name) {
        Optional<Product> productOptional = productRepository.findByName(name);
        if (!productOptional.isPresent()) {
            LOGGER.error("Product with name '{}' not found for deletion", name);
            return false;
        }
        productRepository.delete(productOptional.get());
        LOGGER.debug("Product with name '{}' was deleted from db", name);
        return true;
    }
}
