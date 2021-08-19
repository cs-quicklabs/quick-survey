# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_08_19_105252) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "survey_answers", force: :cascade do |t|
    t.integer "attempt_id"
    t.integer "question_id"
    t.integer "option_id"
    t.boolean "correct"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "survey_attempts", force: :cascade do |t|
    t.integer "participant_id"
    t.integer "survey_id"
    t.boolean "winner"
    t.integer "score"
  end

  create_table "survey_options", force: :cascade do |t|
    t.integer "question_id"
    t.integer "weight", default: 0
    t.string "text"
    t.boolean "correct"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "survey_participant", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "survey_questions", force: :cascade do |t|
    t.integer "survey_id"
    t.string "text"
    t.string "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "survey_surveys", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.integer "attempts_number", default: 0
    t.boolean "finished", default: false
    t.boolean "active", default: false
    t.integer "winning_score", default: 0
    t.integer "type", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

end
