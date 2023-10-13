require "application_system_test_case"

class SurveysTest < ApplicationSystemTestCase
  setup do
    @user = users(:member)
    @account = @user.account
    ActsAsTenant.current_tenant = @account
    @survey = survey_surveys(:one)
    sign_in @user
  end

  def page_url
    surveys_url(script_name: "/#{@account.id}")
  end

  def surveys_page_url
    survey_url(script_name: "/#{@account.id}", id: @survey.id)
  end

  test "member can not view survey home page" do
    login_as users(:member)
    visit page_url
    assert_current_path(dashboard_path(script_name: "/#{@account.id}"))
    page.assert_no_selector "nav.navbar", text: "Surveys"
    take_screenshot
  end

  test "admin can view survey home page and create survey" do
    login_as users(:admin)
    visit page_url
    assert_current_path(surveys_path(script_name: "/#{@account.id}"))
    assert_selector "nav.navbar", text: "Surveys"
    assert_selector "h1", text: "Select Survey"
    assert_text "Add New Survey"
    take_screenshot
  end

  test "super admin can view survey home page and create survey" do
    login_as users(:super_admin)
    visit page_url
    assert_current_path(surveys_path(script_name: "/#{@account.id}"))
    assert_selector "nav.navbar", text: "Surveys"
    assert_selector "h1", text: "Select Survey"
    assert_text "Add New Survey"
    take_screenshot
  end

  test "admin can view any survey details page" do
    login_as users(:admin)
    visit surveys_page_url
    assert_selector "h1", text: @survey.name
    within "#survey-header" do
      assert_text "Actions"
      click_on "Actions"
      assert_text "Edit"
      assert_text "Archive"
      assert_text "Attempt"
      assert_text "Clone"
      assert_text(/Pin Survey|Unpin Survey/)
    end
    take_screenshot
  end

  test "super admin can view any survey details page" do
    login_as users(:super_admin)
    visit surveys_page_url
    assert_selector "h1", text: @survey.name
    within "#survey-header" do
      assert_text "Actions"
      click_on "Actions"
      assert_text "Edit"
      assert_text "Archive"
      assert_text "Attempt"
      assert_text "Clone"
      assert_text(/Pin Survey|Unpin Survey/)
    end
    take_screenshot
  end

  test "admin can view any survey details page if survey archived" do
    login_as users(:admin)
    @archived_survey = survey_surveys(:archived)
    visit survey_url(script_name: "/#{@account.id}", id: @archived_survey)
    assert_selector "h1", text: @survey.name
    within "#survey-header" do
      assert_text "Actions"
      click_on "Actions"
      assert_no_text "Edit"
      assert_text "Unarchive"
      assert_no_text "Attempt"
      assert_no_text "Clone"
      assert_no_text(/Pin Survey|Unpin Survey/)
    end
    take_screenshot
  end

  test "member can view only his survey details page" do
    login_as users(:member)
    visit surveys_page_url
    assert_current_path(dashboard_path(script_name: "/#{@account.id}"))
    member_survey = survey_surveys(:five)
    visit survey_url(script_name: "/#{@account.id}", id: member_survey.id)
    assert_selector "h1", text: member_survey.name
    within "#survey-header" do
      assert_text "Actions"
      click_on "Actions"
      assert_no_text "Edit"
      assert_no_text "Archive"
      assert_no_text "Clone"
      assert_text "Attempt"
      assert_text(/Pin Survey|Unpin Survey/)
    end
    take_screenshot
  end

  test "member can not view any survey details page if survey archived" do
    @archived_survey = survey_surveys(:archived)
    visit survey_url(script_name: "/#{@account.id}", id: @archived_survey)
    assert_current_path(dashboard_path(script_name: "/#{@account.id}"))
    assert_no_selector "h1", text: @survey.name
    take_screenshot
  end

  test "admin can add, edit, delete questions to survey and change order of questions" do
    login_as users(:admin)
    visit surveys_page_url
    assert_text "Add New Question"
    @question = @survey.questions.first
    within "li##{dom_id(@question)}" do
      assert_text @question.text
      assert_text @question.description
      assert_selector "p.drag"
      assert_text "Edit"
      assert_text "Delete"
    end
    take_screenshot
  end

  test " super admin can add, edit, delete questions to survey and change order of questions" do
    login_as users(:super_admin)
    visit surveys_page_url
    assert_text "Add New Question"
    @question = @survey.questions.first
    within "li##{dom_id(@question)}" do
      assert_text @question.text
      assert_text @question.description
      assert_selector "p.drag"
      assert_text "Edit"
      assert_text "Delete"
    end
    take_screenshot
  end

  test "admin can add, edit, delete questions to survey and change order of questions if survey archived" do
    login_as users(:admin)
    @archived_survey = survey_surveys(:archived)
    visit survey_url(script_name: "/#{@account.id}", id: @archived_survey)
    assert_no_text "Add New Question"
    @question = @archived_survey.questions.first
    within "li##{dom_id(@question)}" do
      assert_text @question.text
      assert_text @question.description
      assert_no_selector "p.drag"
      assert_no_text "Edit"
      assert_no_text "Delete"
    end
    take_screenshot
  end

  test "member can not add, edit, delete questions to survey and change order of questions" do
    login_as users(:member)
    member_survey = survey_surveys(:five)
    visit survey_url(script_name: "/#{@account.id}", id: member_survey.id)
    assert_no_text "Add New Question"
    @question = member_survey.questions.first
    within "li##{dom_id(@question)}" do
      assert_text @question.text
      assert_text @question.description
      assert_no_selector "p.drag"
      assert_no_text "Edit"
      assert_no_text "Delete"
    end
    take_screenshot
  end
end
