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

ActiveRecord::Schema[8.1].define(version: 2026_01_13_005713) do
  create_table "checks", force: :cascade do |t|
    t.string "check_type", limit: 100
    t.datetime "created_at", null: false
    t.integer "frequency_id", null: false
    t.datetime "updated_at", null: false
    t.index ["frequency_id"], name: "index_checks_on_frequency_id"
  end

  create_table "checks_schedules", force: :cascade do |t|
    t.integer "check_id", null: false
    t.datetime "created_at", null: false
    t.date "date_created", null: false
    t.text "notes"
    t.boolean "performed", null: false
    t.integer "pet_id", null: false
    t.datetime "updated_at", null: false
    t.index ["check_id"], name: "index_checks_schedules_on_check_id"
    t.index ["performed"], name: "index_checks_schedules_on_performed"
    t.index ["pet_id", "performed"], name: "index_checks_schedules_on_pet_and_performed"
    t.index ["pet_id"], name: "index_checks_schedules_on_pet_id"
  end

  create_table "foods", force: :cascade do |t|
    t.string "amount", limit: 50
    t.datetime "created_at", null: false
    t.datetime "deleted_at"
    t.text "description"
    t.string "food_type", limit: 50
    t.string "name", limit: 100
    t.text "notes"
    t.string "purpose", limit: 100
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_foods_on_deleted_at"
  end

  create_table "frequencies", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "interval_days", null: false
    t.string "name", limit: 50
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_frequencies_on_name_unique", unique: true
  end

  create_table "injuries", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.integer "severity", default: 1
    t.datetime "updated_at", null: false
  end

  create_table "injury_reports", force: :cascade do |t|
    t.string "body_part", limit: 100
    t.datetime "created_at", null: false
    t.date "date"
    t.text "description"
    t.integer "injury_id", null: false
    t.integer "pet_id", null: false
    t.datetime "updated_at", null: false
    t.index ["date"], name: "index_injury_reports_on_date"
    t.index ["injury_id"], name: "index_injury_reports_on_injury_id"
    t.index ["pet_id"], name: "index_injury_reports_on_pet_id"
    t.check_constraint "date <= CURRENT_DATE", name: "check_injury_date_not_future"
  end

  create_table "locations", force: :cascade do |t|
    t.string "address", limit: 255
    t.datetime "created_at", null: false
    t.datetime "deleted_at"
    t.string "name", limit: 100
    t.text "notes"
    t.string "phone_number", limit: 20
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_locations_on_deleted_at"
  end

  create_table "medication_schedules", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "date_ended"
    t.date "date_started", null: false
    t.integer "frequency_id", null: false
    t.integer "medication_id", null: false
    t.text "notes"
    t.integer "pet_id", null: false
    t.datetime "updated_at", null: false
    t.index ["date_ended"], name: "index_medication_schedules_on_date_ended"
    t.index ["date_started"], name: "index_medication_schedules_on_date_started"
    t.index ["frequency_id"], name: "index_medication_schedules_on_frequency_id"
    t.index ["medication_id"], name: "index_medication_schedules_on_medication_id"
    t.index ["pet_id", "date_started"], name: "index_medication_schedules_on_pet_and_date"
    t.index ["pet_id"], name: "index_medication_schedules_on_pet_id"
    t.check_constraint "date_ended IS NULL OR date_ended >= date_started", name: "check_medication_schedule_dates"
  end

  create_table "medications", force: :cascade do |t|
    t.string "amount", limit: 50
    t.datetime "created_at", null: false
    t.datetime "deleted_at"
    t.date "expiration_date"
    t.string "name", limit: 100
    t.text "purpose"
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_medications_on_deleted_at"
  end

  create_table "pet_adoptions", force: :cascade do |t|
    t.date "adoption_date", null: false
    t.decimal "adoption_fee", precision: 10, scale: 2
    t.text "contact_info"
    t.datetime "created_at", null: false
    t.integer "pet_id", null: false
    t.datetime "updated_at", null: false
    t.index ["pet_id"], name: "index_pet_adoptions_on_pet_id"
    t.check_constraint "adoption_date <= CURRENT_DATE", name: "check_adoption_date_not_future"
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
    t.boolean "adopted", default: false, null: false
    t.date "birthday", null: false
    t.string "breed", limit: 100
    t.datetime "created_at", null: false
    t.date "date_admitted", null: false
    t.datetime "deleted_at"
    t.integer "gender", default: 2
    t.integer "location_id"
    t.string "name", limit: 100
    t.string "nickname", limit: 100
    t.text "notes"
    t.string "pet_type", limit: 50
    t.string "picture", limit: 255
    t.datetime "updated_at", null: false
    t.index ["adopted", "location_id"], name: "index_pets_on_adopted_and_location"
    t.index ["adopted"], name: "index_pets_on_adopted"
    t.index ["deleted_at"], name: "index_pets_on_deleted_at"
    t.index ["location_id"], name: "index_pets_on_location_id"
    t.index ["name"], name: "index_pets_on_name"
    t.index ["pet_type"], name: "index_pets_on_pet_type"
  end

  create_table "vaccination_schedules", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "date_given", null: false
    t.integer "frequency_id", null: false
    t.text "notes"
    t.integer "pet_id", null: false
    t.datetime "updated_at", null: false
    t.integer "vaccine_id", null: false
    t.index ["date_given"], name: "index_vaccination_schedules_on_date_given"
    t.index ["frequency_id"], name: "index_vaccination_schedules_on_frequency_id"
    t.index ["pet_id", "date_given"], name: "index_vaccination_schedules_on_pet_and_date"
    t.index ["pet_id", "vaccine_id", "date_given"], name: "index_vaccination_schedules_unique", unique: true
    t.index ["pet_id"], name: "index_vaccination_schedules_on_pet_id"
    t.index ["vaccine_id"], name: "index_vaccination_schedules_on_vaccine_id"
    t.check_constraint "date_given <= CURRENT_DATE", name: "check_vaccination_date_not_future"
  end

  create_table "vaccines", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "deleted_at"
    t.integer "frequency_id", null: false
    t.boolean "mandatory", null: false
    t.string "name", limit: 100
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_vaccines_on_deleted_at"
    t.index ["frequency_id"], name: "index_vaccines_on_frequency_id"
    t.index ["name"], name: "index_vaccines_on_name_unique", unique: true
  end

  add_foreign_key "checks", "frequencies"
  add_foreign_key "checks_schedules", "checks"
  add_foreign_key "checks_schedules", "pets"
  add_foreign_key "injury_reports", "injuries"
  add_foreign_key "injury_reports", "pets"
  add_foreign_key "medication_schedules", "frequencies"
  add_foreign_key "medication_schedules", "medications"
  add_foreign_key "medication_schedules", "pets"
  add_foreign_key "pet_adoptions", "pets"
  add_foreign_key "pet_foods", "foods"
  add_foreign_key "pet_foods", "frequencies"
  add_foreign_key "pet_foods", "pets"
  add_foreign_key "pets", "locations"
  add_foreign_key "vaccination_schedules", "frequencies"
  add_foreign_key "vaccination_schedules", "pets"
  add_foreign_key "vaccination_schedules", "vaccines"
  add_foreign_key "vaccines", "frequencies"
end
