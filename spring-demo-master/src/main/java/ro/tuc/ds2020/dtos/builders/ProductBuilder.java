package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.ProductDTO;
import ro.tuc.ds2020.entities.Product;

public class ProductBuilder {

    private ProductBuilder() {
    }

    public static ProductDTO toProductDTO(Product product) {
        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getQuantity(),
                product.getPrice(),
                product.isInStock()
        );
    }

    public static Product toEntity(ProductDTO productDTO) {
        return new Product(
                productDTO.getName(),
                productDTO.getQuantity(),
                productDTO.getPrice(),
                productDTO.isInStock()
        );
    }
}
