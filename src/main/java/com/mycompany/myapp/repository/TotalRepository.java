package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Total;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Total entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TotalRepository extends JpaRepository<Total, Long> {}
