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

ActiveRecord::Schema[8.1].define(version: 2025_12_12_180905) do
  create_table "checks", force: :cascade do |t|
    t.string "check_type"
    t.datetime "created_at", null: false
    t.integer "frequency_id", null: false
    t.datetime "updated_at", null: false
    t.index ["frequency_id"], name: "index_checks_on_frequency_id"
  end

  create_table "checks_schedules", force: :cascade do |t|
    t.integer "check_id", null: false
    t.datetime "created_at", null: false
    t.date "date_created"
    t.text "notes"
    t.boolean "performed"
    t.integer "pet_id", null: false
    t.datetime "updated_at", null: false
    t.index ["check_id"], name: "index_checks_schedules_on_check_id"
    t.index ["pet_id"], name: "index_checks_schedules_on_pet_id"
  end

  create_table "foods", force: :cascade do |t|
    t.string "amount"
    t.datetime "created_at", null: false
    t.text "description"
    t.string "food_type"
    t.string "name"
    t.text "notes"
    t.string "purpose"
    t.datetime "updated_at", null: false
  end

  create_table "frequencies", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "interval_days", null: false
    t.string "name"
    t.datetime "updated_at", null: false
  end

  create_table "injuries", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.string "severity"
    t.datetime "updated_at", null: false
  end

  create_table "injury_reports", force: :cascade do |t|
    t.string "body_part"
    t.datetime "created_at", null: false
    t.date "date"
    t.text "description"
    t.integer "injury_id", null: false
    t.integer "pet_id", null: false
    t.datetime "updated_at", null: false
    t.index ["injury_id"], name: "index_injury_reports_on_injury_id"
    t.index ["pet_id"], name: "index_injury_reports_on_pet_id"
  end

  create_table "medication_schedules", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "date_ended"
    t.date "date_started"
    t.integer "frequency_id", null: false
    t.integer "medication_id", null: false
    t.text "notes"
    t.integer "pet_id", null: false
    t.datetime "updated_at", null: false
    t.index ["frequency_id"], name: "index_medication_schedules_on_frequency_id"
    t.index ["medication_id"], name: "index_medication_schedules_on_medication_id"
    t.index ["pet_id"], name: "index_medication_schedules_on_pet_id"
  end

  create_table "medications", force: :cascade do |t|
    t.string "amount"
    t.datetime "created_at", null: false
    t.date "expiration_date"
    t.string "name"
    t.text "purpose"
    t.datetime "updated_at", null: false
  end

  create_table "pet_foods", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "food_id", null: false
    t.integer "frequency_id", null: false
    t.text "notes"
    t.integer "pet_id", null: false
    t.date "started_at"
    t.datetime "updated_at", null: false
    t.index ["food_id"], name: "index_pet_foods_on_food_id"
    t.index ["frequency_id"], name: "index_pet_foods_on_frequency_id"
    t.index ["pet_id"], name: "index_pet_foods_on_pet_id"
  end

  create_table "pets", force: :cascade do |t|
    t.date "birthday"
    t.string "breed"
    t.datetime "created_at", null: false
    t.date "date_admitted"
    t.string "gender"
    t.string "name"
    t.string "nickname"
    t.text "notes"
    t.string "pet_type"
    t.string "picture"
    t.datetime "updated_at", null: false
  end

  create_table "vaccination_schedules", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "date_given"
    t.integer "frequency_id", null: false
    t.text "notes"
    t.integer "pet_id", null: false
    t.datetime "updated_at", null: false
    t.integer "vaccine_id", null: false
    t.index ["frequency_id"], name: "index_vaccination_schedules_on_frequency_id"
    t.index ["pet_id"], name: "index_vaccination_schedules_on_pet_id"
    t.index ["vaccine_id"], name: "index_vaccination_schedules_on_vaccine_id"
  end

  create_table "vaccines", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "frequency_id", null: false
    t.boolean "mandatory"
    t.string "name"
    t.datetime "updated_at", null: false
    t.index ["frequency_id"], name: "index_vaccines_on_frequency_id"
  end

  add_foreign_key "checks", "frequencies"
  add_foreign_key "checks_schedules", "checks"
  add_foreign_key "checks_schedules", "pets"
  add_foreign_key "injury_reports", "injuries"
  add_foreign_key "injury_reports", "pets"
  add_foreign_key "medication_schedules", "frequencies"
  add_foreign_key "medication_schedules", "medications"
  add_foreign_key "medication_schedules", "pets"
  add_foreign_key "pet_foods", "foods"
  add_foreign_key "pet_foods", "frequencies"
  add_foreign_key "pet_foods", "pets"
  add_foreign_key "vaccination_schedules", "frequencies"
  add_foreign_key "vaccination_schedules", "pets"
  add_foreign_key "vaccination_schedules", "vaccines"
  add_foreign_key "vaccines", "frequencies"
end
