package ro.tuc.ds2020.dtos;

import org.springframework.hateoas.RepresentationModel;

import java.util.UUID;

public class ProductDTO extends RepresentationModel<ProductDTO> {
    private UUID id;
    private String name;
    private int quantity;
    private double price;
    private boolean inStock;

    public ProductDTO() {
    }

    public ProductDTO(UUID id, String name, int quantity, double price, boolean inStock) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.inStock = inStock;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public boolean isInStock() {
        return inStock;
    }


    public void setInStock(boolean inStock) {
        this.inStock = inStock;
    }
}
