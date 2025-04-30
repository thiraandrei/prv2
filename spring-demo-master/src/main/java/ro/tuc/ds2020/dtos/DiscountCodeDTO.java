package ro.tuc.ds2020.dtos;

import java.util.UUID;

public class DiscountCodeDTO {
    private UUID id;
    private String name;
    private int percentage;

    public DiscountCodeDTO() {
    }

    public DiscountCodeDTO(UUID id, String name, int percentage) {
        this.id = id;
        this.name = name;
        this.percentage = percentage;
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

    public int getPercentage() {
        return percentage;
    }

    public void setPercentage(int percentage) {
        this.percentage = percentage;
    }
}
