'use strict';

function select(selector, scope = document) {
  return scope.querySelector(selector);
}

function listen(event, selector, callback) {
  return selector.addEventListener(event, callback);
}

const userIcon = './src/img/profile-pic.jpg';
const pageContent = select('.page-content');
const postsContainer = select('.posts');
const profilePic = select('.profile-pic');

class User {
  #id;
  #firstName;
  #lastName;
  #userName;
  #email;

  constructor(id, firstName, lastName, userName, email) {
    this.#id = id;
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#userName = userName;
    this.#email = email;
  }

  get id() { return this.#id; }
  get firstName() { return this.#firstName; }
  get lastName() { return this.#lastName; }
  get userName() { return this.#userName; }
  get email() { return this.#email; }

  getInfo() {
    return `
      <p>Username: ${this.userName}</p>
      <p>Name: ${this.firstName} ${this.lastName}</p>
      <p>Email: ${this.email}</p>
    `;
  }
}

class Subscriber extends User {
  #pages;
  #groups;
  #canMonetize;

  constructor(id, firstName, lastName, userName, email, pages, groups, canMonetize) {
    super(id, firstName, lastName, userName, email);
    this.#pages = pages;
    this.#groups = groups;
    this.#canMonetize = canMonetize;
  }

  get pages() { return this.#pages; }
  get groups() { return this.#groups; }
  get canMonetize() { return this.#canMonetize; }

  getInfo() {
    return `
      ${super.getInfo()}
      <p>Pages: ${this.pages.join(', ')}</p>
      <p>Groups: ${this.groups.join(', ')}</p>
      <p>Can Monetize: ${this.canMonetize ? 'Yes' : 'No'}</p>
    `;
  }
}

const sub = new Subscriber(
  new Date(),
  'Samuel',
  'Reutcky',
  'sam_r246',
  'sreutcky@gmail.com',
  ['JavaScript for beginners', 'Python for beginners'],
  ['Car meets Winnipeg', 'Crested Gecko care'],
  true
);

loadPage();

function loadPage() {
  const contentForm = document.createElement('form');
  contentForm.classList.add('flex', 'flex-column');
  contentForm.innerHTML = `
    <textarea class="post-input" placeholder="What's on your mind, ${sub.firstName}?" rows="8"></textarea>
    <div class="flex flex-between flex-end">
      <label for="image">
        <div class="flex">
          <i class="fa-solid fa-image"></i>
          <p class="selected-file">No file selected</p>
        </div>
      </label>
      <input id="image" type="file">
      <input type="button" id="post-button" value="Post">
    </div>
  `;

  pageContent.appendChild(contentForm);
}

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

function createPost(text, image) {
  const post = document.createElement('div');
  post.classList.add('post');

  const postHeader = document.createElement('div');
  postHeader.classList.add('post-header');
  postHeader.innerHTML = `
    <img src="${userIcon}" alt="Profile Picture" class="profile-pic">
    <div>
      <p class="username">${sub.userName}</p>
      <p class="post-date">${new Date().toLocaleString('en-CA', options)}</p>
    </div>
  `;

  const postContent = document.createElement('div');
  postContent.classList.add('post-content');
  
  if (text) {
    const postText = document.createElement('p');
    postText.textContent = text;
    postContent.appendChild(postText);
  }

  if (image) {
    const postImage = document.createElement('img');
    postImage.src = URL.createObjectURL(image);
    postImage.alt = 'Uploaded Image';
    postContent.appendChild(postImage);
  }

  post.appendChild(postHeader);
  post.appendChild(postContent);

  postsContainer.prepend(post);
}

const fileDisplay = select('.selected-file');
const fileSelector = select('#image');
const postButton = select('#post-button');
const textInput = select('.post-input');

listen('change', fileSelector, function (file) {
  const selectedFile = file.target.files[0];
  const fileName = selectedFile ? selectedFile.name : '';
  fileDisplay.textContent = fileName || 'No file selected';
});

listen('click', postButton, () => {
  const text = textInput.value.trim();
  const image = fileSelector.files[0];

  if (text || image) {
    createPost(text, image);
    textInput.value = ''; 
    fileSelector.value = '';
    fileDisplay.textContent = 'No file selected';
  }
});

listen('click', profilePic, () => {
  const modal = select('.user-info-modal');
  const userInfoElement = select('.user-info');
  userInfoElement.innerHTML = `
    ${sub.getInfo()}
  `;
  modal.style.display = 'flex';
});

const modal = select('.user-info-modal');
listen('click', modal, function (event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});
