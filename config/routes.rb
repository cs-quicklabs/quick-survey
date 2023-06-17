Rails.application.routes.draw do
  require "sidekiq/web"
  require "sidekiq-scheduler/web"

  mount Sidekiq::Web => "/sidekiq"
  mount ActionCable.server => "/cable"

  devise_for :users
  resources :user
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root :to => "root#index"
  resources :surveys do
    resources :questions
  end

  get "/surveys/:id/attempts/new", to: "attempts#new", as: "new_attempt"
  get "/surveys/:id/clone", to: "surveys#clone", as: "clone_survey"

  get "/resume", to: "screening/resume#index", as: "resume"
  get "/telephonic", to: "screening/telephonic#index", as: "telephonic"
  get "/interview", to: "screening/interview#index", as: "interview"
  get "/hr", to: "screening/hr#index", as: "hr"
  get "/vendor", to: "screening/vendor#index", as: "vendor"
  get "/space_folders", to: "space/folders#space_folders", as: "space_folders"
  get "/change_folder/:survey_id/:folder_id", to: "space/folders#change_folder", as: "change_folder"

  post "/surveys/:id/attempts/new", to: "attempts#create"
  get "/attempts", to: "attempts#index", as: "survey_attempts"
  get "/attempts/:id", to: "attempts#show", as: "new_survey_attempt"
  get "/pdf/checklist/:id", to: "reports#checklist", as: "checklist_pdf"
  get "/pdf/score/:id", to: "reports#score", as: "score_pdf"
  get "/reports/checklist/:id", to: "reports#checklist", as: "checklist_report"
  get "/reports/score/:id", to: "reports#score", as: "score_report"
  get "/attempts/:id/submit", to: "attempts#submit", as: "submit_attempt"
  patch "/attempts/:id/submit", to: "reports#submit", as: "submit_report"

  scope "archive" do
    get "/surveys", to: "surveys#archived", as: "archived_surveys"
    get "/survey/:id", to: "surveys#archive_survey", as: "archive_survey"
    get "/survey/:id/restore", to: "surveys#unarchive_survey", as: "unarchive_survey"
    get "/users", to: "user#deactivated", as: "deactivated_users"
    get "/users/:id", to: "user#deactivate_user", as: "deactivate_user"
    get "/users/:id/restore", to: "user#activate_user", as: "activate_user"
  end

  get "/search/surveys", to: "search#surveys"
  get "/search/spaces-surveys-and-folders", to: "search#spaces_surveys_and_folders"
  get "/search/archived_surveys", to: "search#archived_surveys"
  get "/search/archived_users", to: "search#archived_users"
  scope "/settings" do
    get "/profile", to: "user#profile", as: "profile"
    get "/password", to: "user#password", as: "setting_password"
    patch "/password", to: "user#update_password", as: "change_password"
    get "/preferences", to: "user#preferences", as: "user_preferences"
  end
  put ":id/permission", to: "user#update_permission", as: "set_permission"
  resources :spaces do
    resources :folders, module: "space"
  end
  scope "/spaces" do
    get ":id/pin", to: "spaces#pin", as: "space_pin"
    get ":id/unpin", to: "spaces#unpin", as: "space_unpin"
    get ":id/archive", to: "spaces#archive", as: "space_archive"
    get ":id/unarchive", to: "spaces#unarchive", as: "space_unarchive"
  end
end
