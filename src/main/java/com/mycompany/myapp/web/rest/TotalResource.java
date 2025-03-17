package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Total;
import com.mycompany.myapp.repository.TotalRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Total}.
 */
@RestController
@RequestMapping("/api/totals")
@Transactional
public class TotalResource {

    private static final Logger LOG = LoggerFactory.getLogger(TotalResource.class);

    private static final String ENTITY_NAME = "total";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TotalRepository totalRepository;

    public TotalResource(TotalRepository totalRepository) {
        this.totalRepository = totalRepository;
    }

    /**
     * {@code POST  /totals} : Create a new total.
     *
     * @param total the total to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new total, or with status {@code 400 (Bad Request)} if the total has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Total> createTotal(@Valid @RequestBody Total total) throws URISyntaxException {
        LOG.debug("REST request to save Total : {}", total);
        if (total.getId() != null) {
            throw new BadRequestAlertException("A new total cannot already have an ID", ENTITY_NAME, "idexists");
        }
        total = totalRepository.save(total);
        return ResponseEntity.created(new URI("/api/totals/" + total.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, total.getId().toString()))
            .body(total);
    }

    /**
     * {@code PUT  /totals/:id} : Updates an existing total.
     *
     * @param id the id of the total to save.
     * @param total the total to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated total,
     * or with status {@code 400 (Bad Request)} if the total is not valid,
     * or with status {@code 500 (Internal Server Error)} if the total couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Total> updateTotal(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Total total)
        throws URISyntaxException {
        LOG.debug("REST request to update Total : {}, {}", id, total);
        if (total.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, total.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!totalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        total = totalRepository.save(total);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, total.getId().toString()))
            .body(total);
    }

    /**
     * {@code PATCH  /totals/:id} : Partial updates given fields of an existing total, field will ignore if it is null
     *
     * @param id the id of the total to save.
     * @param total the total to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated total,
     * or with status {@code 400 (Bad Request)} if the total is not valid,
     * or with status {@code 404 (Not Found)} if the total is not found,
     * or with status {@code 500 (Internal Server Error)} if the total couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Total> partialUpdateTotal(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Total total
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Total partially : {}, {}", id, total);
        if (total.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, total.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!totalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Total> result = totalRepository
            .findById(total.getId())
            .map(existingTotal -> {
                if (total.getMedia() != null) {
                    existingTotal.setMedia(total.getMedia());
                }

                return existingTotal;
            })
            .map(totalRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, total.getId().toString())
        );
    }

    /**
     * {@code GET  /totals} : get all the totals.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of totals in body.
     */
    @GetMapping("")
    public List<Total> getAllTotals() {
        LOG.debug("REST request to get all Totals");
        return totalRepository.findAll();
    }

    /**
     * {@code GET  /totals/:id} : get the "id" total.
     *
     * @param id the id of the total to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the total, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Total> getTotal(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Total : {}", id);
        Optional<Total> total = totalRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(total);
    }

    /**
     * {@code DELETE  /totals/:id} : delete the "id" total.
     *
     * @param id the id of the total to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTotal(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Total : {}", id);
        totalRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
