Rails.application.routes.draw do
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

  post "/surveys/:id/attempts/new", to: "attempts#create"
  get "/attempts", to: "attempts#index", as: "survey_attempts"
  get "/attempts/:id", to: "attempts#show", as: "new_survey_attempt"
  get "/pdf/checklist/:id", to: "reports#checklist", as: "checklist_pdf"
  get "/pdf/score/:id", to: "reports#score", as: "score_pdf"
  get "/reports/checklist/:id", to: "reports#checklist", as: "checklist_report"
  get "/reports/score/:id", to: "reports#score", as: "score_report"
  get "/attempts/:id/submit", to: "attempts#submit", as: "submit_attempt"
  patch "/attempts/:id/submit", to: "reports#submit", as: "submit_report"

  get "/search/surveys", to: "search#surveys"
  scope "/settings" do
    get "/profile", to: "user#profile", as: "profile"
    get "/password", to: "user#password", as: "setting_password"
    patch "/password", to: "user#update_password", as: "change_password"
    get "/preferences", to: "user#preferences", as: "user_preferences"
  end
  put ":id/permission", to: "user#update_permission", as: "set_permission"
end
