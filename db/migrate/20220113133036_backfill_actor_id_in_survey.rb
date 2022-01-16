class BackfillActorIdInSurvey < ActiveRecord::Migration[7.0]
  def change
    Survey::Attempt.update_all(actor_id: 6)
  end
end
