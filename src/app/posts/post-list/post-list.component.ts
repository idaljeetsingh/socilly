import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Post} from '../post.model';
import {PostService} from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First post', content: 'This is content'},
  //   {title: 'Second post', content: 'This is content'},
  //   {title: 'Third post', content: 'This is content'},
  //   {title: 'Fourth post', content: 'This is content'},
  // ];
  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(public postService: PostService) {
  }

  ngOnInit(): void {
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListener().subscribe((post) => {
      this.posts = post;
    });
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
