package com.example.planningservice.controller;

import com.example.planningservice.model.Planning;
import com.example.planningservice.repository.PlanningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200") // <-- autorise Angular
@RestController
@RequestMapping("/plannings")
public class PlanningController {

    @Autowired
    private PlanningRepository planningRepository;

    @GetMapping
    public List<Planning> getAllPlannings() {
        return planningRepository.findAll();
    }

    @PostMapping
    public Planning createPlanning(@RequestBody Planning planning) {
        return planningRepository.save(planning);
    }
}
