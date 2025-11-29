import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TagService, Tag } from '../../services/tag.service';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class TagSelectorComponent implements OnInit {
  @Input() initialTags: string[] = [];
  @Output() tagsChange = new EventEmitter<string[]>();

  selectedTags: string[] = [];
  searchTerm: string = '';
  suggestedTags: Tag[] = [];
  popularTags: Tag[] = [];

  constructor(private tagService: TagService) { }

  ngOnInit() {
    this.selectedTags = [...this.initialTags];
    this.loadPopularTags();
  }

  loadPopularTags() {
    this.tagService.getPopularTags(5).subscribe(tags => {
      this.popularTags = tags;
    });
  }

  onSearchChange(event: any) {
    const query = event.detail.value;
    this.searchTerm = query;

    if (query && query.length > 1) {
      this.tagService.searchTags(query).subscribe(tags => {
        // Filter out already selected tags
        this.suggestedTags = tags.filter(t => !this.selectedTags.includes(t.name));
      });
    } else {
      this.suggestedTags = [];
    }
  }

  addTag(tagName: string) {
    const normalizedTag = tagName.toLowerCase().trim();
    if (normalizedTag && !this.selectedTags.includes(normalizedTag)) {
      this.selectedTags.push(normalizedTag);
      this.tagsChange.emit(this.selectedTags);
      this.searchTerm = ''; // Clear search
      this.suggestedTags = []; // Clear suggestions
    }
  }

  removeTag(tag: string) {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
    this.tagsChange.emit(this.selectedTags);
  }

  onEnter() {
    if (this.searchTerm) {
      this.addTag(this.searchTerm);
    }
  }
}
