class Survey < ActiveRecord::Migration[6.1]
  def change
    # survey surveys logic
    create_table :survey_surveys do |t|
      t.string :name
      t.text :description
      t.integer :attempts_number, :default => 0
      t.boolean :finished, :default => false
      t.boolean :active, :default => false
      t.integer :winning_score, :default => 0
      t.integer :survey_type, :default => 0

      t.timestamps
    end

    create_table :survey_questions do |t|
      t.integer :survey_id
      t.string :text
      t.string :description

      t.timestamps
    end

    create_table :survey_options do |t|
      t.integer :question_id
      t.integer :weight, :default => 0
      t.string :text
      t.boolean :correct

      t.timestamps
    end

    create_table :survey_attempts do |t|
      t.integer :participant_id
      t.integer :survey_id
      t.boolean :winner
      t.integer :score
    end

    create_table :survey_answers do |t|
      t.integer :attempt_id
      t.integer :question_id
      t.integer :option_id
      t.boolean :correct
      t.timestamps
    end

    create_table :survey_participant do |t|
      t.string :name
      t.string :email

      t.timestamps null: false
    end
  end
end
