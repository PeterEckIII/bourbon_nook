package com.bourbon_nook.bottles_api.repositories;

import com.bourbon_nook.bottles_api.entities.BottleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BottleRepository extends JpaRepository<BottleEntity, String> {
    List<BottleEntity> findAllByUserId(String userId);
    Optional<BottleEntity> findByIdAndUserId(String id, String userId);
    @Query("SELECT b FROM BottleEntity b WHERE " +
                    "(:userId IS NULL OR b.userId = :userId) AND " +
                    "(:name IS NULL OR LOWER(b.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
                    "(:distillery IS NULL OR LOWER(b.distillery) LIKE LOWER(CONCAT('%', :distillery, '%'))) AND " +
                    "(:producer IS NULL OR LOWER(b.producer) LIKE LOWER(CONCAT('%', :producer, '%'))) AND " +
                    "(:minPrice IS NULL OR b.price >= :minPrice) AND " +
                    "(:maxPrice IS NULL OR b.price <= :maxPrice)"
        )
    List<BottleEntity> findWithFilters(
            @Param("userId") String userId,
            @Param("name") String name,
            @Param("distillery") String distillery,
            @Param("producer") String producer,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice
    );
}
