import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TagService, Tag } from 'src/app/shared/services/tag.service';
import { BlogService } from 'src/app/shared/services/blog';
import { Models } from 'src/app/shared/models/models';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.page.html',
  styleUrls: ['./tags.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class TagsPage implements OnInit {

  popularTags: Tag[] = [];
  allTags: Tag[] = [];
  selectedTag: string | null = null;
  blogs: Models.Blog.Blog[] = [];
  isLoading = false;

  constructor(
    private tagService: TagService,
    private blogService: BlogService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadTags();

    // Check if a tag is passed via query params
    this.route.queryParams.subscribe(params => {
      if (params['tag']) {
        this.selectTag(params['tag']);
      }
    });
  }

  loadTags() {
    this.tagService.getPopularTags(10).subscribe(tags => {
      this.popularTags = tags;
    });

    this.tagService.getTags().subscribe(tags => {
      this.allTags = tags.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  selectTag(tagName: string) {
    this.selectedTag = tagName;
    this.isLoading = true;
    this.blogService.getBlogsByTag(tagName).subscribe(blogs => {
      this.blogs = blogs;
      this.isLoading = false;
    });
  }

  clearSelection() {
    this.selectedTag = null;
    this.blogs = [];
  }

}
