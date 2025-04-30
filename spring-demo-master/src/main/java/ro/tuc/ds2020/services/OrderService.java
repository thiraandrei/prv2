package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.dtos.OrderDTO;
import ro.tuc.ds2020.dtos.ProductDTO;
import ro.tuc.ds2020.dtos.builders.OrderBuilder;
import ro.tuc.ds2020.dtos.builders.ProductBuilder;
import ro.tuc.ds2020.entities.Order;
import ro.tuc.ds2020.entities.Product;
import ro.tuc.ds2020.repositories.OrderRepository;
import ro.tuc.ds2020.repositories.ProductRepository;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private static final Logger LOGGER = LoggerFactory.getLogger(OrderService.class);
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;

    @Autowired
    public OrderService(OrderRepository orderRepository, ProductRepository productRepository, ProductService productService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.productService = productService;
    }

    public List<OrderDTO> findAllOrders() {
        List<Order> orderList = orderRepository.findAll();
        return orderList.stream()
                .map(OrderBuilder::toOrderDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO findOrderById(UUID id) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (!orderOptional.isPresent()) {
            LOGGER.error("Order with id {} was not found in db", id);
            throw new ResourceNotFoundException("Order with id: " + id);
        }
        return OrderBuilder.toOrderDTO(orderOptional.get());
    }

    public UUID insert(OrderDTO orderDTO) {
        Order order = OrderBuilder.toEntity(orderDTO);

        // Căutăm produsul după nume
        Optional<Product> productOpt = productRepository.findByName(order.getProduct());
        if (!productOpt.isPresent()) {
            throw new ResourceNotFoundException("Product not found with name: " + order.getProduct());
        }

        Product product = productOpt.get();
        int newQuantity = product.getQuantity() - order.getQuantity();
        if (newQuantity < 0) {
            throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
        }

        ProductDTO updatedProduct = new ProductDTO(
                product.getId(),
                product.getName(),
                newQuantity,
                product.getPrice(),
                newQuantity > 0
        );

        productService.updateProduct(product.getName(), updatedProduct);

        // Salvăm comanda
        order = orderRepository.save(order);
        LOGGER.debug("Order with id {} was inserted in db", order.getId());

        return order.getId();
    }

    public OrderDTO updateOrder(UUID id, OrderDTO orderDTO) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (!orderOptional.isPresent()) {
            LOGGER.error("Order with id {} not found for update", id);
            throw new ResourceNotFoundException("Order with id: " + id);
        }

        Order order = orderOptional.get();
        order.setFirstName(orderDTO.getFirstName());
        order.setLastName(orderDTO.getLastName());
        order.setEmail(orderDTO.getEmail());
        order.setAddress(orderDTO.getAddress());
        order.setProduct(orderDTO.getProduct());
        order.setQuantity(orderDTO.getQuantity());
        order.setStatus(orderDTO.getStatus());

        Order updatedOrder = orderRepository.save(order);
        LOGGER.debug("Order with id {} was updated", updatedOrder.getId());
        return OrderBuilder.toOrderDTO(updatedOrder);
    }

    public boolean deleteOrder(UUID id) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (!orderOptional.isPresent()) {
            LOGGER.error("Order with id {} not found for deletion", id);
            throw new ResourceNotFoundException("Order with id: " + id);
        }

        orderRepository.delete(orderOptional.get());
        LOGGER.debug("Order with id {} was deleted", id);
        return true;
    }
}
