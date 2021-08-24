Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root "surveys#index"

  resources :surveys do
    resources :questions
  end

  get "/surveys/:id/attempts/new", to: "attempts#new", as: "new_attempt"
  post "/surveys/:id/attempts/new", to: "attempts#create"
  get "/attempts/:id", to: "attempts#show", as: "new_survey_attempt"
  get "/reports/checklist/:id", to: "reports#checklist", as: "checklist_report"
  get "/attempts/:id/submit", to: "attempts#submit", as: "submit_attempt"

  get "/search/surveys", to: "search#surveys"
end
