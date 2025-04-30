package ro.tuc.ds2020.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.dtos.DiscountCodeDTO;
import ro.tuc.ds2020.dtos.builders.DiscountCodeBuilder;
import ro.tuc.ds2020.entities.DiscountCode;
import ro.tuc.ds2020.repositories.DiscountCodeRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DiscountCodeService {

    private final DiscountCodeRepository discountCodeRepository;

    @Autowired
    public DiscountCodeService(DiscountCodeRepository discountCodeRepository) {
        this.discountCodeRepository = discountCodeRepository;
    }

    public List<DiscountCodeDTO> findAllCodes() {
        return discountCodeRepository.findAll().stream()
                .map(DiscountCodeBuilder::toDiscountCodeDTO)
                .collect(Collectors.toList());
    }

    public DiscountCodeDTO findByName(String name) {
        Optional<DiscountCode> found = discountCodeRepository.findByName(name);
        return found.map(DiscountCodeBuilder::toDiscountCodeDTO).orElse(null);
    }

    public UUID insert(DiscountCodeDTO dto) {
        DiscountCode code = DiscountCodeBuilder.toEntity(dto);
        code = discountCodeRepository.save(code);
        return code.getId();
    }

    public DiscountCodeDTO update(String name, DiscountCodeDTO dto) {
        Optional<DiscountCode> existing = discountCodeRepository.findByName(name);
        if (!existing.isPresent()) return null;
        DiscountCode code = existing.get();
        code.setName(dto.getName());
        code.setPercentage(dto.getPercentage());
        return DiscountCodeBuilder.toDiscountCodeDTO(discountCodeRepository.save(code));
    }

    public boolean delete(String name) {
        Optional<DiscountCode> existing = discountCodeRepository.findByName(name);
        if (!existing.isPresent()) return false;
        discountCodeRepository.delete(existing.get());
        return true;
    }
}
