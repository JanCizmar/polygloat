package com.polygloat.persistance;

import com.polygloat.model.Translation;
import com.polygloat.model.User;
import com.polygloat.repository.TranslationRepository;
import com.polygloat.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
public class PersistenceTest {

    @Autowired
    UserRepository userRepository;

    @Test
    public void testInsert() {
        User user = new User();
        String benUsername = "ben";

        user.setUsername(benUsername);
        userRepository.save(user);

        User ben = userRepository.getBen();
        assertThat(ben.getUsername()).isEqualTo(benUsername);
    }

}
