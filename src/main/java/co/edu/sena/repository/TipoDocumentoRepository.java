package co.edu.sena.repository;

import co.edu.sena.domain.TipoDocumento;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the TipoDocumento entity.
 */
@Repository
public interface TipoDocumentoRepository extends JpaRepository<TipoDocumento, Long> {
    default Optional<TipoDocumento> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<TipoDocumento> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<TipoDocumento> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct tipoDocumento from TipoDocumento tipoDocumento left join fetch tipoDocumento.user",
        countQuery = "select count(distinct tipoDocumento) from TipoDocumento tipoDocumento"
    )
    Page<TipoDocumento> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct tipoDocumento from TipoDocumento tipoDocumento left join fetch tipoDocumento.user")
    List<TipoDocumento> findAllWithToOneRelationships();

    @Query("select tipoDocumento from TipoDocumento tipoDocumento left join fetch tipoDocumento.user where tipoDocumento.id =:id")
    Optional<TipoDocumento> findOneWithToOneRelationships(@Param("id") Long id);
}
