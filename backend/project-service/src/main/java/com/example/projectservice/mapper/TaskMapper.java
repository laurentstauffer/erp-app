package com.example.projectservice.mapper;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import com.example.projectservice.dto.TaskDTO;
import com.example.projectservice.model.Task;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Mapping(source = "status", target = "status", qualifiedByName = "statusToString")
    @Mapping(source = "startDate", target = "startDate", qualifiedByName = "dateToString")
    @Mapping(source = "dueDate", target = "dueDate", qualifiedByName = "dateToString")
    @Mapping(source = "predecessors", target = "predecessorIds", qualifiedByName = "predecessorsToIds")
    TaskDTO toDto(Task task);
    
    @Mapping(target = "project", ignore = true)
    @Mapping(target = "predecessors", ignore = true) // Géré manuellement dans le service
    @Mapping(target = "successors", ignore = true)
    @Mapping(source = "status", target = "status", qualifiedByName = "stringToStatus")
    @Mapping(source = "startDate", target = "startDate", qualifiedByName = "stringToDate")
    @Mapping(source = "dueDate", target = "dueDate", qualifiedByName = "stringToDate")
    Task toEntity(TaskDTO dto);

    List<TaskDTO> toDtoList(List<Task> tasks);
    
    @Named("statusToString")
    default String statusToString(Task.TaskStatus status) {
        return status != null ? status.name() : "TODO";
    }
    
    @Named("stringToStatus")
    default Task.TaskStatus stringToStatus(String status) {
        if (status == null || status.isEmpty()) {
            return Task.TaskStatus.TODO;
        }
        try {
            return Task.TaskStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            return Task.TaskStatus.TODO;
        }
    }
    
    @Named("dateToString")
    default String dateToString(LocalDate date) {
        return date != null ? date.format(DateTimeFormatter.ISO_DATE) : null;
    }
    
    @Named("stringToDate")
    default LocalDate stringToDate(String date) {
        if (date == null || date.isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(date, DateTimeFormatter.ISO_DATE);
        } catch (Exception e) {
            return null;
        }
    }
    
    @Named("predecessorsToIds")
    default List<Long> predecessorsToIds(List<Task> predecessors) {
        if (predecessors == null) {
            return new ArrayList<>();
        }
        return predecessors.stream()
            .map(Task::getId)
            .collect(Collectors.toList());
    }
}
