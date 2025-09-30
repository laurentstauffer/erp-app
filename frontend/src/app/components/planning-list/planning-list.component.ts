import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningService, Planning } from '../../services/planning.service';

@Component({
  selector: 'app-planning-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planning-list.component.html',
  styleUrls: ['./planning-list.component.css']
})
export class PlanningListComponent implements OnInit {
  plannings: Planning[] = [];

  constructor(private planningService: PlanningService) {}

  ngOnInit(): void {
    this.planningService.getPlannings().subscribe(data => {
      this.plannings = data;
    });
  }
}
