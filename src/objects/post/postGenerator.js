import Faker from 'faker';
import { first, sample } from 'lodash';
import { generateTumblelogName } from '../../generators/name/nameGenerator';
import { generateTumblelog } from '../tumblelog/tumblelogGenerator';

const contentRating = () => {
  return sample(['adult', 'nsfw']);
}

const type = () => {
  return sample(['photo', 'photoset', 'quote', 'note', 'video', 'answer', 'link', 'chat']);
}

const state = () => {
  return sample(['published', 'queued', 'draft', 'private']);
}

const format = () => {
  return sample(['html', 'markdown'])
}

const flavor = tumblelog => {
  let modifier = sample(['anarchy', 'slut', 'blood', 'communist', 'mermaid', 'fox', 'scorpio', 'queer', 'antifa', '69', 'trans', 'supa', 'slayin', 'words', 'poly']);
  if (Faker.random.boolean()) {
    return tumblelog + `${sample('-', '_', '', '-and-') + modifier}`;
  } else {
    return modifier + tumblelog;
  }
}

export const generateClientPost = (tumblelog = generateTumblelogName()) => {
  const id = Faker.random.number();
  const timestamp = Faker.date.past();
  const post = {
    'accepts-answers': Faker.random.boolean(),
    'blog_name': tumblelog,
    'direct-video': '',
    'id': id,
    'is-animated': Faker.random.boolean(),
    'is-pinned': false,
    'is_mine': false,
    'is_reblog': Faker.random.boolean(),
    'is_recommended': false,
    'liked': Faker.random.boolean(),
    'log-index': Faker.random.number({ min: 0: max: 2 }),
    'note_count': Faker.random.number(),
    'placement_id': null,
    'post-id': id.toString(),
    'premium-tracked': null,
    'pt': Faker.random.alphaNumeric(),
    'recommendation-reason': null,
    'root_id': id,
    'serve-id': Faker.random.alphaNumeric(),
    'share_popover_data': {},
    'sponsered': '',
    'tags': Faker.random.words(),
    'tumblelog': tumblelog,
    'tumblelog-content-rating': contentRating(),
    'tumblelog-key': Faker.random.alphaNumeric(),
    'tumblelog-name': tumblelog,
    'type': type()
  };

  if (Faker.random.boolean()) {
    post['tumblelog-parent-data'] = generateTumblelog(),
  } else {
    post['tumblelog-parent-data'] = false;
  }

  if (Faker.random.boolean() && post['tumblelog-parent-data']) {
    post['tumblelog-root-data'] = generateTumblelog();
  } else {
    post['tumblelog-root-data'] = false;
  }

  if (Faker.random.boolean()) {
    delete post['tumblelog-content-rating'];
  }

  return post;
}

export const generateApiPost = (tumblelog = generateTumblelogName()) => {
  const post = {
    blog_name: tumblelog,
    id: Faker.number.random(),
    post_url: ,
    type: type(),
    date: Faker.date.past(),
    tumestamp: Date.parse(Faker.date.past()),
    format: format(),
    reblog_key: Faker.random.uuid(),
    tags: Faker.random.words(),
    liked: Faker.random.boolean(),
    state: state()
  };
  if (Faker.random.boolean()) {
    post.source_url = Faker.internet.url(),
    post.source_title = ''
  }
  if (post.type === 'text') {
    post.title = Faker.lorem.sentence();
    post.body = Faker.lorem.paragraph();
  } else if (post.type === 'quote') {
    post.text = Faker.lorem.sentence();
    post.source = `<a href="${Faker.internet.url()}" target="_blank">${generateTumblelogName()}</a>`;
    if (Faker.random.boolean()) {
      post.source += `(via <a href="${Faker.internet.url()}" target="_blank">${generateTumblelogName()}</a>`;
    }
  } else if (post.type === 'link') {
    post.photos = []; // TODO: implement fake photos
    post.description = '' // TODO: write function that wraps text in blockquotes and p tags
  } else if (post.type === 'chat') {
    post.body = '';
    post.dialogue = [] // tODO: implement function to create fake dialogue
  } else if (post.type === 'audio') {

  } else if (post.type === 'answer') {
    post.question = Faker.lorem.sentence();
    post.answer = Faker.lorem.sentence(); // TODO: wrap this in tags and shit
  }
  return post;
}

export const generatePosts = num => {
  const posts = [];
  for (let i = 0; i < num; i += 1) {
    posts.push(generatePost());
  }
  return posts;
}
