package com.polygloat.exceptions;

import com.polygloat.constants.Message;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@EqualsAndHashCode(callSuper = true)
@ResponseStatus(value = HttpStatus.NOT_FOUND)
@AllArgsConstructor
@NoArgsConstructor
@Data
public class NotFoundException extends RuntimeException {
    private Message msg;
}
