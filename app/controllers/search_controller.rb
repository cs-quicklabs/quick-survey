class SearchController < ApplicationController
  def surveys
    like_keyword = "%#{params[:q]}%"
    if params[:folder_id].present?
      @surveys = Survey::Survey.active.where("name ILIKE ? AND folder_id = ?", like_keyword, params[:folder_id]).limit(10).order(:name)
    else
      @surveys = Survey::Survey.all.active.where(folder_id: nil).where("name ILIKE ?", like_keyword).limit(10).order(:name)
    end
    render layout: false
  end

  def spaces_surveys_and_folders
    like_keyword = "%#{params[:q]}%"
    @surveys = Survey::Survey.where("name ILIKE ?", like_keyword)
      .limit(10).order(:name).limit(4)
    @spaces = Space.where("title ILIKE ?", like_keyword).limit(4)
    @folders = Folder.where("title ILIKE ?", like_keyword).limit(4)
    render layout: false
  end

  def archived_surveys
    like_keyword = "%#{params[:q]}%"
    @surveys = Survey::Survey.inactive.where("name ILIKE ?", like_keyword).limit(10).order(:name)
    render layout: false
  end

  def archived_users
    like_keyword = "%#{params[:q]}%"
    @users = User.inactive.where("first_name iLIKE ANY ( array[?] )", like_keyword)
      .or(User.inactive.where("last_name iLIKE ANY ( array[?] )", like_keyword))
      .order(:first_name)
    render layout: false
  end
end
