package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.TotalAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Total;
import com.mycompany.myapp.repository.TotalRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TotalResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TotalResourceIT {

    private static final Double DEFAULT_MEDIA = 1D;
    private static final Double UPDATED_MEDIA = 2D;

    private static final String ENTITY_API_URL = "/api/totals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TotalRepository totalRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTotalMockMvc;

    private Total total;

    private Total insertedTotal;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Total createEntity() {
        return new Total().media(DEFAULT_MEDIA);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Total createUpdatedEntity() {
        return new Total().media(UPDATED_MEDIA);
    }

    @BeforeEach
    public void initTest() {
        total = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedTotal != null) {
            totalRepository.delete(insertedTotal);
            insertedTotal = null;
        }
    }

    @Test
    @Transactional
    void createTotal() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Total
        var returnedTotal = om.readValue(
            restTotalMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(total)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Total.class
        );

        // Validate the Total in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTotalUpdatableFieldsEquals(returnedTotal, getPersistedTotal(returnedTotal));

        insertedTotal = returnedTotal;
    }

    @Test
    @Transactional
    void createTotalWithExistingId() throws Exception {
        // Create the Total with an existing ID
        total.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTotalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(total)))
            .andExpect(status().isBadRequest());

        // Validate the Total in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkMediaIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        total.setMedia(null);

        // Create the Total, which fails.

        restTotalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(total)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTotals() throws Exception {
        // Initialize the database
        insertedTotal = totalRepository.saveAndFlush(total);

        // Get all the totalList
        restTotalMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(total.getId().intValue())))
            .andExpect(jsonPath("$.[*].media").value(hasItem(DEFAULT_MEDIA)));
    }

    @Test
    @Transactional
    void getTotal() throws Exception {
        // Initialize the database
        insertedTotal = totalRepository.saveAndFlush(total);

        // Get the total
        restTotalMockMvc
            .perform(get(ENTITY_API_URL_ID, total.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(total.getId().intValue()))
            .andExpect(jsonPath("$.media").value(DEFAULT_MEDIA));
    }

    @Test
    @Transactional
    void getNonExistingTotal() throws Exception {
        // Get the total
        restTotalMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTotal() throws Exception {
        // Initialize the database
        insertedTotal = totalRepository.saveAndFlush(total);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the total
        Total updatedTotal = totalRepository.findById(total.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTotal are not directly saved in db
        em.detach(updatedTotal);
        updatedTotal.media(UPDATED_MEDIA);

        restTotalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTotal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedTotal))
            )
            .andExpect(status().isOk());

        // Validate the Total in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTotalToMatchAllProperties(updatedTotal);
    }

    @Test
    @Transactional
    void putNonExistingTotal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        total.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTotalMockMvc
            .perform(put(ENTITY_API_URL_ID, total.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(total)))
            .andExpect(status().isBadRequest());

        // Validate the Total in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTotal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        total.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTotalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(total))
            )
            .andExpect(status().isBadRequest());

        // Validate the Total in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTotal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        total.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTotalMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(total)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Total in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTotalWithPatch() throws Exception {
        // Initialize the database
        insertedTotal = totalRepository.saveAndFlush(total);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the total using partial update
        Total partialUpdatedTotal = new Total();
        partialUpdatedTotal.setId(total.getId());

        partialUpdatedTotal.media(UPDATED_MEDIA);

        restTotalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTotal.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTotal))
            )
            .andExpect(status().isOk());

        // Validate the Total in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTotalUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedTotal, total), getPersistedTotal(total));
    }

    @Test
    @Transactional
    void fullUpdateTotalWithPatch() throws Exception {
        // Initialize the database
        insertedTotal = totalRepository.saveAndFlush(total);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the total using partial update
        Total partialUpdatedTotal = new Total();
        partialUpdatedTotal.setId(total.getId());

        partialUpdatedTotal.media(UPDATED_MEDIA);

        restTotalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTotal.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTotal))
            )
            .andExpect(status().isOk());

        // Validate the Total in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTotalUpdatableFieldsEquals(partialUpdatedTotal, getPersistedTotal(partialUpdatedTotal));
    }

    @Test
    @Transactional
    void patchNonExistingTotal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        total.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTotalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, total.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(total))
            )
            .andExpect(status().isBadRequest());

        // Validate the Total in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTotal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        total.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTotalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(total))
            )
            .andExpect(status().isBadRequest());

        // Validate the Total in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTotal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        total.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTotalMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(total)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Total in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTotal() throws Exception {
        // Initialize the database
        insertedTotal = totalRepository.saveAndFlush(total);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the total
        restTotalMockMvc
            .perform(delete(ENTITY_API_URL_ID, total.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return totalRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Total getPersistedTotal(Total total) {
        return totalRepository.findById(total.getId()).orElseThrow();
    }

    protected void assertPersistedTotalToMatchAllProperties(Total expectedTotal) {
        assertTotalAllPropertiesEquals(expectedTotal, getPersistedTotal(expectedTotal));
    }

    protected void assertPersistedTotalToMatchUpdatableProperties(Total expectedTotal) {
        assertTotalAllUpdatablePropertiesEquals(expectedTotal, getPersistedTotal(expectedTotal));
    }
}
