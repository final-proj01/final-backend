const pool = require('../utils/pool');

module.exports = class Clip {
  id;
  clip_link;
  users_id;
  o_site;
  created_at;
  description;
  title;
  comments;
  users;
  votes;

  constructor(row) {
    this.id = row.id;
    this.clip_link = row.clip_link;
    this.users_id = row.users_id;
    this.o_site = row.o_site;
    this.created_at = row.created_at;
    this.title = row.title;
    this.description = row.description;
    this.comments = row.comments || [];
    this.votes = row.votes || [];
  }

  static async getClipsById(id) {
    const { rows } = await pool.query(`
    select * from (select user_clips.*,
      coalesce (json_agg(to_jsonb(comments))
      filter (where comments.id is not null), '[]')
      as comments
      from user_clips
      left join comments on user_clips.id = comments.clip_id
                 where user_clips.users_id = $1
      group by user_clips.id)
      as comments_agg
      inner join (select user_clips.id as user_clips_id, 
                 coalesce (json_agg(to_jsonb(votes))
                           filter (where votes.id is not null), '[]')
                 as votes
                 from user_clips
                 left join votes on user_clips.id = votes.clip_id
                 group by user_clips_id)
                 as votes_agg
                 on comments_agg.id = votes_agg.user_clips_id
                 order by comments_agg.id desc`, [id]);

    return rows.map(clip => new Clip(clip));
  }

  static async getAllClips() {
    const { rows } = await pool.query(`select * from (select user_clips.*,
      coalesce (json_agg(to_jsonb(comments))
      filter (where comments.id is not null), '[]')
      as comments
      from user_clips
      left join comments on user_clips.id = comments.clip_id
      group by user_clips.id)
      as comments_agg
      inner join (select user_clips.id as user_clips_id, 
                 coalesce (json_agg(to_jsonb(votes))
                           filter (where votes.id is not null), '[]')
                 as votes
                 from user_clips
                 left join votes on user_clips.id = votes.clip_id
                 group by user_clips_id)
                 as votes_agg
                 on comments_agg.id = votes_agg.user_clips_id
                 order by comments_agg.id desc`);

    return rows.map(row => new Clip(row));
  }

  static async insertClip({ title, description, o_site, clip_link }, id) {
    const { rows } = await pool.query(`
    insert into user_clips (users_id, description, title, o_site, clip_link) values ($1, $2, $3, $4, $5)
    returning *
    `, [id, description, title, o_site, clip_link]);

    return new Clip(rows[0]);
  }

  static async addVote({ vote_up, clip_id, voter_id }) {
    const { rows } = await pool.query(`
    insert into votes (vote_up, clip_id, voter_id) values ($1, $2, $3)
    returning *
    `, [vote_up, clip_id, voter_id]);

    return new Clip(rows[0]);
  }

  static async addComment(comment) {
    const { rows } = await pool.query(`
    insert into comments (details, clip_id, commenter_id) values ($1, $2, $3)
    returning *
  `, [comment.details, comment.clip_id, comment.commenter_id]);
    return new Clip(rows[0]);
  }

  static async delById(id) {
    await pool.query('delete from comments where clip_id = $1', [id]);
    await pool.query('delete from votes where clip_id = $1', [id]);
    const { rows } = await pool.query(`
    delete from user_clips where id = $1 returning *
    `, [id]);

    return new Clip(rows[0]);
  }

  static async getClipById(id) {
    const { rows } = await pool.query(`
    select * from user_clips where id = $1
    `, [id]);

    return new Clip(rows[0]);
  }

  static async updateById(id, updatedClip) {
    const clip = Clip.getClipById(id);
    if (!clip) return null;
    const { title, description } = { ...clip, ...updatedClip };
    const { rows } = await pool.query(`
    update user_clips 
    set title = $1, description = $2 where id = $3
    returning *
    `, [title, description, id]);

    return new Clip(rows[0]);
  }

  static async getVotesById(id) {
    const { rows } = await pool.query(`
    select user_clips.*,
    coalesce (json_agg(to_jsonb(votes))
    filter (where votes.id is not null), '[]')
    as votes
    from user_clips
    left join votes on votes.id = user_clips.id
    where user_clips.id = $1
    group by user_clips.id
    `, [id]);
    if (!rows[0]) return null;
    return new Clip(rows[0]);
  }
};
