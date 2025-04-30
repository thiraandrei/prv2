package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.OrderDTO;
import ro.tuc.ds2020.entities.Order;

public class OrderBuilder {

    private OrderBuilder() {
    }

    public static OrderDTO toOrderDTO(Order order) {
        return new OrderDTO(
                order.getId(),
                order.getFirstName(),
                order.getLastName(),
                order.getEmail(),
                order.getAddress(),
                order.getProductName(),
                order.getQuantity(),
                order.getStatus()
        );
    }

    public static Order toEntity(OrderDTO orderDTO) {
        return new Order(
                orderDTO.getFirstName(),
                orderDTO.getLastName(),
                orderDTO.getEmail(),
                orderDTO.getAddress(),
                orderDTO.getProductName(),
                orderDTO.getQuantity(),
                orderDTO.getStatus()
        );
    }
}
