package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.DiscountCodeDTO;
import ro.tuc.ds2020.services.DiscountCodeService;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/discount-codes")
public class DiscountCodeController {

    private final DiscountCodeService discountCodeService;

    @Autowired
    public DiscountCodeController(DiscountCodeService discountCodeService) {
        this.discountCodeService = discountCodeService;
    }

    @GetMapping
    public ResponseEntity<List<DiscountCodeDTO>> getAll() {
        return new ResponseEntity<>(discountCodeService.findAllCodes(), HttpStatus.OK);
    }

    @GetMapping("/{name}")
    public ResponseEntity<DiscountCodeDTO> getByName(@PathVariable String name) {
        DiscountCodeDTO code = discountCodeService.findByName(name);
        return code != null ? new ResponseEntity<>(code, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<Void> insert(@RequestBody DiscountCodeDTO dto) {
        discountCodeService.insert(dto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/{name}")
    public ResponseEntity<DiscountCodeDTO> update(@PathVariable String name, @RequestBody DiscountCodeDTO dto) {
        DiscountCodeDTO updated = discountCodeService.update(name, dto);
        return updated != null ? new ResponseEntity<>(updated, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<Void> delete(@PathVariable String name) {
        return discountCodeService.delete(name) ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
