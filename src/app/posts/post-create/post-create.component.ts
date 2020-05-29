import {Component, OnInit} from '@angular/core';
import {Post} from '../post.model';
import {FormControl, NgForm, Validators} from '@angular/forms';
import {PostService} from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
content = '';
title = '';
  constructor(public postService: PostService) {

  }
  enteredTitle = '';
  enteredContent = '';

  ngOnInit(): void {
// console.log(this.title);
  }

  onAddPost(form: NgForm) {
    const post: Post = {
      id: null,
      title: form.value.title,
      content: form.value.content
    };
    this.postService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }

}
