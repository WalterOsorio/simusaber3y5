package co.edu.sena.repository;

import co.edu.sena.domain.Administrador;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Administrador entity.
 */
@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
    default Optional<Administrador> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Administrador> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Administrador> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct administrador from Administrador administrador left join fetch administrador.user",
        countQuery = "select count(distinct administrador) from Administrador administrador"
    )
    Page<Administrador> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct administrador from Administrador administrador left join fetch administrador.user")
    List<Administrador> findAllWithToOneRelationships();

    @Query("select administrador from Administrador administrador left join fetch administrador.user where administrador.id =:id")
    Optional<Administrador> findOneWithToOneRelationships(@Param("id") Long id);
}
