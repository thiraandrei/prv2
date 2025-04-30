package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.tuc.ds2020.entities.Order;

import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    // Additional custom queries can be defined here
}
