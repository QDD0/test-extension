package org.example.testextension.repositories;

import org.example.testextension.models.ActivityEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityEventRepository extends JpaRepository<ActivityEvent,Long> {
}
