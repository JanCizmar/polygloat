package com.polygloat.controllers;

import com.polygloat.model.Translation;
import com.polygloat.repository.TranslationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/translations")
public class TranslationController {

    private TranslationRepository translationRepository;

    @Autowired
    public TranslationController(TranslationRepository translationRepository) {
        this.translationRepository = translationRepository;
    }

    @RequestMapping("")
    public List<Translation> getTranslations(){
        return translationRepository.findAll();
    }
}
