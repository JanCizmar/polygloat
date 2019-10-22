package com.polygloat;

import com.polygloat.model.Language;
import com.polygloat.model.Translation;
import com.polygloat.repository.TranslationRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest
public class PersistenceTest {

    @Autowired
    private TranslationRepository translationRepository;

    @Test
    public void testInsert(){
        Translation translation = new Translation();
        translation.setDescription("aaa");
        translation.setTitle("aasdl");
        translationRepository.save(translation);

    }

}
