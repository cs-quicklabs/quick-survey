class SearchPolicy < Struct.new(:user, :search)
  def surveys?
    !user.member?
  end

  def spaces_surveys_and_folders?
    !user.member?
  end

  def archived_surveys?
    !user.member?
  end

  def archived_users?
    !user.member?
  end
end
