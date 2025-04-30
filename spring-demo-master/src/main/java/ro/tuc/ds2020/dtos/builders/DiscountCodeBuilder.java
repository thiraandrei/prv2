package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.DiscountCodeDTO;
import ro.tuc.ds2020.entities.DiscountCode;

public class DiscountCodeBuilder {

    public static DiscountCodeDTO toDiscountCodeDTO(DiscountCode discountCode) {
        return new DiscountCodeDTO(discountCode.getId(), discountCode.getName(), discountCode.getPercentage());
    }

    public static DiscountCode toEntity(DiscountCodeDTO dto) {
        return new DiscountCode(dto.getName(), dto.getPercentage());
    }
}
