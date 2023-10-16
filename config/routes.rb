Rails.application.routes.draw do

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  devise_for :users, controllers: { invitations: "invitations", registrations: "registrations" }
  post "/register", to: "registrations#create"

  resources :users, only: [:index, :show, :edit, :update]
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root :to => "dashboard#index"

  resources :surveys do
    get "/attempts", to: "surveys#attempts", as: "attempts"
    resources :questions
    get "/pdf/checklist/:id", to: "survey/reports#checklist", as: "checklist_pdf"
    get "/pdf/score/:id", to: "survey/reports#score", as: "score_pdf"
    get "/reports/checklist/:id", to: "survey/reports#checklist", as: "checklist_report"
    get "/reports/score/:id", to: "survey/reports#score", as: "score_report"
    patch "/attempts/:id/attempt", to: "attempts#submit", as: "submit_attempt"
    patch "/attempts/:id/submit", to: "submit#submit", as: "submit_report"
    get "/submit/checklist/:id", to: "submit#checklist", as: "checklist_submit"
    get "/submit/score/:id", to: "submit#score", as: "score_submit"
  end

  get "/dashboard", to: "dashboard#index", as: "dashboard"
  get "/questions/reorder", to: "questions#reorder", as: "reorder_questions"
  get :activities, controller: :dashboard
  get "resend_invitation/:id", to: "users#resend_invitation", as: "resend_invitation_user"

  resources :users do
    get "/attempts", to: "user/attempts#index", as: "attempts"
    get "/surveys", to: "user/surveys#index", as: "surveys"
    get "/spaces", to: "user/spaces#index", as: "spaces"
  end

  get "/surveys/:id/attempts/new", to: "attempts#new", as: "new_attempt"
  get "/surveys/:id/clone", to: "surveys#clone", as: "clone_survey"
  get "/surveys/:id/pin", to: "surveys#pin", as: "pin_survey"
  get "/surveys/:id/unpin", to: "surveys#unpin", as: "unpin_survey"
  get "/answer/:id", to: "attempts#answer", as: "answer_attempt"
  get "/score/:id", to: "attempts#score", as: "score_attempt"

  get "/resume", to: "screening/resume#index", as: "resume"
  get "/telephonic", to: "screening/telephonic#index", as: "telephonic"
  get "/interview", to: "screening/interview#index", as: "interview"
  get "/hr", to: "screening/hr#index", as: "hr"
  get "/vendor", to: "screening/vendor#index", as: "vendor"
  post "/change_folder/:id", to: "space/folders#change_folder", as: "change_folder"

  post "/surveys/:id/attempts/new", to: "attempts#create"
  get "/attempts", to: "attempts#index", as: "attempts"
  get "/attempts/:id", to: "attempts#show", as: "new_survey_attempt"

  scope "archive" do
    get "/surveys", to: "surveys#archived", as: "archived_surveys"
    get "/survey/:id", to: "surveys#archive_survey", as: "archive_survey"
    get "/survey/:id/restore", to: "surveys#unarchive_survey", as: "unarchive_survey"
    get "/users", to: "users#deactivated", as: "deactivated_users"
    get "/users/:id", to: "users#deactivate_user", as: "deactivate_user"
    get "/users/:id/restore", to: "users#activate_user", as: "activate_user"
  end

  get "/search/surveys", to: "search#surveys"
  get "/search/spaces-surveys-and-folders", to: "search#spaces_surveys_and_folders"
  get "/search/archived_surveys", to: "search#archived_surveys"
  get "/search/archived_users", to: "search#archived_users"
  scope "/settings" do
    get "/profile", to: "user#profile", as: "profile"
    get "/password", to: "user#password", as: "setting_password"
    patch "/password", to: "user#update_password", as: "change_password"
    patch "/profile", to: "user#update_profile", as: "update_profile"
    get "/preferences", to: "user#preferences", as: "user_preferences"
  end
  put ":id/permission", to: "user#update_permission", as: "set_permission"
  resources :spaces do
    resources :folders, module: "space" do
      collection do
        get "folders"
      end
    end
  end

  scope "/spaces" do
    get ":id/pin", to: "spaces#pin", as: "space_pin"
    get ":id/unpin", to: "spaces#unpin", as: "space_unpin"
    get ":id/archive", to: "spaces#archive", as: "space_archive"
    get ":id/unarchive", to: "spaces#unarchive", as: "space_unarchive"
  end
end
