package com.polygloat.repository;

import com.polygloat.model.Language;
import com.polygloat.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("select u from User u where username = 'ben'")
    User getBen();
}
