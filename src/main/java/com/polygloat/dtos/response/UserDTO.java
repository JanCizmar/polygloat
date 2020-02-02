package com.polygloat.dtos.response;

import com.polygloat.model.Permission;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {

    private Long id;

    private String name;

    private String username;

    public static UserDTO fromEntity(com.polygloat.model.UserAccount user) {
        return UserDTO.builder().username(user.getUsername()).name(user.getName()).id(user.getId()).build();
    }
}
