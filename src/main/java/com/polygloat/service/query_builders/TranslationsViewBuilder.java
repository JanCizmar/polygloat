package com.polygloat.service.query_builders;

import com.polygloat.model.*;

import javax.persistence.criteria.*;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

public class TranslationsViewBuilder {
    private final Repository repository;
    private final Set<String> abbrs;
    private final String searchString;
    Set<Selection<?>> selection = new LinkedHashSet<>();
    Set<Expression<String>> fullTextFields = new HashSet<>();
    Set<Predicate> restrictions = new HashSet<>();
    private CriteriaBuilder cb;

    public TranslationsViewBuilder(CriteriaBuilder cb, Repository repository, Set<String> abbrs, String searchString) {
        this.cb = cb;
        this.repository = repository;
        this.abbrs = abbrs;
        this.searchString = searchString;
    }

    public <T> CriteriaQuery<T> getBaseQuery(CriteriaQuery<T> query1) {
        Root<File> file = query1.from(File.class);
        Join<File, Source> source = file.join(File_.source, JoinType.LEFT);

        Selection<String> fullPath = getFullPath(file);

        selection.add(fullPath);
        //for isSource property
        selection.add(file.get(File_.source).get(Source_.id));

        for (String abbr : abbrs) {
            SetJoin<Source, Translation> translations = source.join(Source_.translations, JoinType.LEFT);
            Join<Translation, Language> language = translations.join(Translation_.language, JoinType.LEFT);

            restrictions.add(cb.or(cb.equal(language.get(Language_.abbreviation), abbr), cb.isNull(file.get(File_.source))));

            selection.add(language.get(Language_.abbreviation));
            selection.add(translations.get(Translation_.text));
            fullTextFields.add(translations.get(Translation_.text));
        }

        restrictions.add(cb.equal(file.get(File_.repository), repository));
        restrictions.add(cb.isNotNull(file.get(File_.name)));

        Set<Predicate> fullTextRestrictions = new HashSet<>();

        fullTextFields.add((Expression<String>) fullPath);

        if (searchString != null && !searchString.isEmpty()) {
            for (Expression<String> fullTextField : fullTextFields) {
                fullTextRestrictions.add(cb.like(cb.upper(fullTextField), "%" + searchString.toUpperCase() + "%"));
            }
            restrictions.add(cb.or(fullTextRestrictions.toArray(new Predicate[0])));
        }

        query1.where(restrictions.toArray(new Predicate[0]));

        return query1;
    }

    @SuppressWarnings("unchecked")
    public CriteriaQuery<Object> getDataQuery() {
        CriteriaQuery<Object> query1 = getBaseQuery(cb.createQuery());

        Root<File> file = (Root<File>) query1.getRoots().iterator().next();

        Selection<String> fullPath = getFullPath(file);

        Selection<?>[] paths = selection.toArray(new Selection<?>[0]);

        query1.multiselect(paths);
        query1.orderBy(cb.asc((Expression<?>) fullPath));
        return query1;
    }

    @SuppressWarnings("unchecked")
    public CriteriaQuery<Long> getCountQuery() {
        CriteriaQuery<Long> query = getBaseQuery(cb.createQuery(Long.class));

        Root<File> file = (Root<File>) query.getRoots().iterator().next();

        query.select(cb.count(file));
        return query;
    }


    private Selection<String> getFullPath(Root<File> file) {
        return cb.concat(file.get(File_.materializedPath), cb.concat(".", file.get(File_.name)));
    }

}
