delete from public.question_logs where module = 'cyber';
delete from public.simulations where module = 'cyber';

update public.topics
set
  accuracy = 0,
  questions_done = 0,
  errors = 0,
  last_studied_at = null,
  next_review_at = null,
  status = 'pending'
where module = 'cyber';

update public.flashcards
set review_stage = 0
where module = 'cyber';
